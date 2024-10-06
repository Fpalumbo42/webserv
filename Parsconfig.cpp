/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Parsconfig.cpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: fpalumbo <fpalumbo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/28 18:09:23 by fpalumbo          #+#    #+#             */
/*   Updated: 2024/09/25 09:56:43 by fpalumbo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Parsconfig.hpp"

Parsconfig::Parsconfig()
    : _Methods(NULL), _UploadsMethods(NULL) {}

Parsconfig::Parsconfig(std::string file)
    : _Methods(NULL), _UploadsMethods(NULL)
{
    start(file);
}

Parsconfig::~Parsconfig()
{
}

void Parsconfig::parseErrorPages(const std::string &locationBlock)
{
    std::string errors[] = {"error400", "error403", "error404", "error405", "error413", "error500", "error504", "error505"};
    for (size_t i = 0; i < sizeof(errors) / sizeof(errors[0]); ++i)
    {
        std::string error = errors[i];
        std::string errorPage = get_value(error + " = \"", locationBlock);
        if (!errorPage.empty())
        {
            int errorCode = std::atoi(error.substr(5).c_str());
            _ErrorPages[errorCode] = errorPage;
        }
        else
        {
            throw Parsconfig::BadErrorPage();
        }
    }
}

void Parsconfig::parseCgiPaths(const std::string &locationBlock)
{
    std::string tmps[] = {"script1", "script2"};
    for (size_t i = 0; i < sizeof(tmps) / sizeof(tmps[0]); ++i)
    {
        std::string tmp = tmps[i];
        std::string value = get_value(tmp + " = \"", locationBlock);
        if (!value.empty())
        {
            _CgiPaths[tmp] = value;
        }
        else
        {
            throw Parsconfig::BadCgiBin();
        }
    }
}

void Parsconfig::parseDataPaths(const std::string &locationBlock)
{
    std::string tmps[] = {"index", "upload"};
    for (size_t i = 0; i < sizeof(tmps) / sizeof(tmps[0]); ++i)
    {
        std::string tmp = tmps[i];
        std::string value = get_value(tmp + " = \"", locationBlock);
        if (!value.empty())
        {
            _DataPaths[tmp] = value;
        }
        else
        {
            throw Parsconfig::BadData();
        }
    }
}

void Parsconfig::parseUploadPaths(const std::string &locationBlock)
{
    std::string tmp = "allow_methods";
    std::string value = get_value(tmp + " = \"", locationBlock);
    _UploadsMethods = ft_split_string(value, _nbUploadsMethods);

    if (_nbUploadsMethods == 0)
        throw(Parsconfig::Badmethods());
    for (int i = 0; i < _nbUploadsMethods; ++i)
    {
        if (_UploadsMethods[i] != "GET" && _UploadsMethods[i] != "POST" && _UploadsMethods[i] != "DELETE")
            throw(Parsconfig::Badmethods());
    }
}

int *Parsconfig::ft_split_int(const std::string &str, int &size)
{
    std::vector<int> numbers;
    std::stringstream ss(str);
    std::string token;

    while (std::getline(ss, token, ' '))
    {
        if (!token.empty())
            numbers.push_back(std::atoi(token.c_str()));
    }

    size = numbers.size();
    int *result = new int[size];
    for (int i = 0; i < size; ++i)
    {
        result[i] = numbers[i];
    }
    return result;
}

std::string *Parsconfig::ft_split_string(const std::string &str, int &size)
{
    std::vector<std::string> strings;
    std::stringstream ss(str);
    std::string token;

    while (std::getline(ss, token, ' '))
    {
        if (!token.empty())
            strings.push_back(token);
    }

    size = strings.size();
    std::string *result = new std::string[size];
    for (int i = 0; i < size; ++i)
    {
        result[i] = strings[i];
    }

    return result;
}

std::string Parsconfig::get_value(const std::string &tmp, const std::string &file)
{
    size_t found = file.find(tmp);
    if (found == std::string::npos)
    {
        return "";
    }

    found += tmp.size();
    size_t end = file.find_first_of("\";\n", found);
    if (end == std::string::npos)
    {
        return "";
    }

    return file.substr(found, end - found);
}

int Parsconfig::start(std::string str_file)
{
    std::string line;
    size_t i = 0;
    std::string tmp_str;
    int tmp_int = 0;

    /* Serveur name */
    _Name = get_value("server_name = \"", str_file);
    if (_Name.empty())
    {
        _Name = "DefaultName";
    }

    /* Host */
    _Host = get_value("host = \"", str_file);
    if (_Host.empty())
        throw(Parsconfig::BadHost());

    /* Port */
    i = 0;

    tmp_str = get_value("listen = \"", str_file);
    if (tmp_str.empty())
        throw(Parsconfig::BadPort());

    while (i != tmp_str.size())
    {
        if (!isdigit(tmp_str[i]) && tmp_str[i] != ' ')
            throw(Parsconfig::BadPort());
        i++;
    }

    int *tmpPort = ft_split_int(tmp_str, _NumberPorts);
    if (_NumberPorts == 0)
        throw(Parsconfig::BadPort());

    i = 0;
    while ((int)i != _NumberPorts)
    {
        if (tmpPort[i] <= 1023 || tmpPort[i] >= 65536)
            throw(Parsconfig::BadPort());

        if (tmpPort[i] >= 49152 && tmpPort[i] <= 65535)
            throw(Parsconfig::BadPort());

        i++;
    }

    _Port.clear();
    for (int j = 0; j < _NumberPorts; j++)
    {
        _Port.push_back(tmpPort[j]);
    }

    delete[] tmpPort;

    /* Methods */
    i = 0;
    tmp_str = get_value("methods = \"", str_file);
    _Methods = ft_split_string(tmp_str, _NumberMethods);
    if (_NumberMethods == 0)
        throw(Parsconfig::Badmethods());
    while ((int)i != _NumberMethods)
    {
        if (_Methods[i] != "GET" && _Methods[i] != "POST" && _Methods[i] != "DELETE")
            throw(Parsconfig::Badmethods());
        i++;
    }

    /* autoindex */
    tmp_str = get_value("autoindex = \"", str_file);
    if (tmp_str == "on")
        _AutoIndex = true;
    else if (tmp_str == "off")
        _AutoIndex = false;
    else
        throw(Parsconfig::BadAutoIndex());

    /* Body size*/

    i = 0;
    tmp_str = get_value("client_max_body_size = \"", str_file);
    while (i != tmp_str.size())
    {
        if (!isdigit(tmp_str[i]))
            throw(Parsconfig::BadBodySize());
        i++;
    }

    long tmp_long = std::atol(tmp_str.c_str());
    if (tmp_long > INT_MAX)
        throw(Parsconfig::BadBodySize());

    tmp_int = static_cast<int>(tmp_long);
    _BodySize = tmp_int;
    if (_BodySize <= 0)
        throw(Parsconfig::BadBodySize());

    /* error_pages */
    size_t defaultPagesPos = str_file.find("error_pages {");
    if (defaultPagesPos == std::string::npos)
    {
        throw(Parsconfig::BadErrorPage());
    }
    if (defaultPagesPos != std::string::npos)
    {
        size_t braceOpenPos = str_file.find("{", defaultPagesPos);
        size_t braceClosePos = str_file.find("}", braceOpenPos);
        if (braceOpenPos != std::string::npos && braceClosePos != std::string::npos)
        {
            std::string block = str_file.substr(braceOpenPos + 1, braceClosePos - braceOpenPos - 1);
            parseErrorPages(block);
        }
    }

    /* data */
    size_t dataPos = str_file.find("data {");
    if (dataPos == std::string::npos)
    {
        throw(Parsconfig::BadData());
    }
    if (dataPos != std::string::npos)
    {
        size_t braceOpenPos = str_file.find("{", dataPos);
        size_t braceClosePos = str_file.find("}", braceOpenPos);
        if (braceOpenPos != std::string::npos && braceClosePos != std::string::npos)
        {
            std::string block = str_file.substr(braceOpenPos + 1, braceClosePos - braceOpenPos - 1);
            parseDataPaths(block);
        }
    }

    /* cgibin */
    size_t cgiBinPos = str_file.find("cgi-bin {");
    if (cgiBinPos == std::string::npos)
    {
        throw(Parsconfig::BadCgiBin());
    }
    if (cgiBinPos != std::string::npos)
    {
        size_t braceOpenPos = str_file.find("{", cgiBinPos);
        size_t braceClosePos = str_file.find("}", braceOpenPos);
        if (braceOpenPos != std::string::npos && braceClosePos != std::string::npos)
        {
            std::string block = str_file.substr(braceOpenPos + 1, braceClosePos - braceOpenPos - 1);
            parseCgiPaths(block);
        }
    }

    /* uploads */
    size_t uploadsPos = str_file.find("uploads {");
    if (uploadsPos == std::string::npos)
    {
        throw(Parsconfig::BadUploads());
    }
    if (uploadsPos != std::string::npos)
    {
        size_t braceOpenPos = str_file.find("{", uploadsPos);
        size_t braceClosePos = str_file.find("}", braceOpenPos);
        if (braceOpenPos != std::string::npos && braceClosePos != std::string::npos)
        {
            std::string block = str_file.substr(braceOpenPos + 1, braceClosePos - braceOpenPos - 1);
            parseUploadPaths(block);
        }
    }

    // Test output
    std::cout << std::endl;
    std::cout << _Name << std::endl;
    for (size_t i = 0; i < _Port.size(); ++i)
    {
        std::cout << _Port[i] << std::endl;
    }
    for (int i = 0; i < _NumberMethods; ++i)
    {
        std::cout << _Methods[i] << " ";
    }
    std::cout << std::endl;
    std::cout << _BodySize << std::endl;
    std::cout << _AutoIndex << std::endl;

    std::map<int, std::string>::iterator it = _ErrorPages.begin();
    while (it != _ErrorPages.end())
    {
        std::cout << it->second << std::endl;
        it++;
    }

    std::map<std::string, std::string>::iterator jt = _DataPaths.begin();
    while (jt != _DataPaths.end())
    {
        std::cout << jt->second << std::endl;
        jt++;
    }

    std::map<std::string, std::string>::iterator xt = _CgiPaths.begin();
    while (xt != _CgiPaths.end())
    {
        std::cout << xt->second << std::endl;
        xt++;
    }

    int j = 0;
    while (j != _nbUploadsMethods)
    {
        std::cout << _UploadsMethods[j] << std::endl;
        j++;
    }
    std::cout << std::endl;
    std::cout << "------------------" << std::endl;
    std::cout << std::endl;

    return 0;
}

void Parsconfig::freeAllocatedResources()
{
    if (_Methods != NULL)
    {
        delete[] _Methods;
        _Methods = NULL;
    }

    if (_UploadsMethods != NULL)
    {
        delete[] _UploadsMethods;
        _UploadsMethods = NULL;
    }

    _ErrorPages.clear();
    _DataPaths.clear();
    _CgiPaths.clear();
    _Port.clear();
}
